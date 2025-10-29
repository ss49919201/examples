package handler

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"path"
	"strings"

	"github.com/example/s3viewre/internal/service"
)

type Handler struct {
	s3Service *service.S3Service
	templates *template.Template
}

type HomePageData struct {
	Buckets []service.Bucket
	Error   string
}

type BucketPageData struct {
	BucketName string
	Prefix     string
	Objects    []service.Object
	Breadcrumbs []Breadcrumb
	Error      string
}

type Breadcrumb struct {
	Name string
	Path string
}

type ObjectDetailPageData struct {
	BucketName string
	ObjectKey  string
	Detail     *service.ObjectDetail
	FormattedSize string
	Error      string
}

func NewHandler(s3Svc *service.S3Service) *Handler {
	// テンプレートのロード
	tmpl, err := template.ParseGlob("templates/*.html")
	if err != nil {
		log.Printf("Warning: failed to parse templates: %v", err)
		// テンプレートなしでも動作するように
	}

	return &Handler{
		s3Service: s3Svc,
		templates: tmpl,
	}
}

// HandleHome はホームページ（バケット一覧）を処理
func (h *Handler) HandleHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	ctx := context.Background()
	buckets, err := h.s3Service.ListBuckets(ctx)

	data := HomePageData{
		Buckets: buckets,
	}

	if err != nil {
		data.Error = err.Error()
		log.Printf("Error listing buckets: %v", err)
	}

	if h.templates != nil {
		if err := h.templates.ExecuteTemplate(w, "index.html", data); err != nil {
			log.Printf("Template execution error: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	} else {
		// テンプレートない場合は簡易HTML
		renderHomeHTML(w, data)
	}
}

// HandleBucket はバケット内のオブジェクト一覧を処理
func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
	bucketName := strings.TrimPrefix(r.URL.Path, "/bucket/")
	if bucketName == "" || strings.Contains(bucketName, "/") {
		http.NotFound(w, r)
		return
	}

	prefix := r.URL.Query().Get("prefix")
	searchKeyword := r.URL.Query().Get("search")

	ctx := context.Background()
	objects, err := h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)

	// パンくずリストを生成
	breadcrumbs := h.generateBreadcrumbs(prefix)

	data := BucketPageData{
		BucketName:  bucketName,
		Prefix:      prefix,
		Objects:     objects,
		Breadcrumbs: breadcrumbs,
	}

	if err != nil {
		data.Error = err.Error()
		log.Printf("Error listing objects: %v", err)
	}

	if h.templates != nil {
		if err := h.templates.ExecuteTemplate(w, "bucket.html", data); err != nil {
			log.Printf("Template execution error: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	} else {
		renderBucketHTML(w, data)
	}
}

// HandleObject はオブジェクトの詳細情報を処理
func (h *Handler) HandleObject(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.TrimPrefix(r.URL.Path, "/object/"), "/")
	if len(pathParts) < 2 {
		http.NotFound(w, r)
		return
	}

	bucketName := pathParts[0]
	objectKey := strings.Join(pathParts[1:], "/")

	// URL デコード
	objectKey, err := url.QueryUnescape(objectKey)
	if err != nil {
		http.Error(w, "Invalid object key", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	detail, err := h.s3Service.GetObjectDetail(ctx, bucketName, objectKey)

	formattedSize := ""
	if detail != nil {
		formattedSize = service.FormatFileSize(detail.Size)
	}

	data := ObjectDetailPageData{
		BucketName:    bucketName,
		ObjectKey:     objectKey,
		Detail:        detail,
		FormattedSize: formattedSize,
	}

	if err != nil {
		data.Error = err.Error()
		log.Printf("Error getting object detail: %v", err)
	}

	if h.templates != nil {
		if err := h.templates.ExecuteTemplate(w, "object.html", data); err != nil {
			log.Printf("Template execution error: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	} else {
		renderObjectHTML(w, data)
	}
}

// generateBreadcrumbs はパンくずリストを生成
func (h *Handler) generateBreadcrumbs(prefix string) []Breadcrumb {
	var breadcrumbs []Breadcrumb

	// ルートを追加
	breadcrumbs = append(breadcrumbs, Breadcrumb{
		Name: "Root",
		Path: "",
	})

	if prefix == "" {
		return breadcrumbs
	}

	prefix = strings.TrimSuffix(prefix, "/")
	parts := strings.Split(prefix, "/")

	currentPath := ""
	for _, part := range parts {
		if part == "" {
			continue
		}
		currentPath += part + "/"
		breadcrumbs = append(breadcrumbs, Breadcrumb{
			Name: part,
			Path: currentPath,
		})
	}

	return breadcrumbs
}

// 簡易HTML レンダリング関数（テンプレートがない場合のフォールバック）

func renderHomeHTML(w http.ResponseWriter, data HomePageData) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	html := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>S3 Bucket Viewer</title>
		<style>
			body { font-family: Arial, sans-serif; margin: 20px; }
			h1 { color: #333; }
			.error { color: red; }
			.bucket-list { margin-top: 20px; }
			.bucket-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
			a { color: #0066cc; }
		</style>
	</head>
	<body>
		<h1>S3 Bucket Viewer</h1>
	`

	if data.Error != "" {
		html += `<div class="error">Error: ` + data.Error + `</div>`
	}

	html += `<div class="bucket-list">`
	for _, bucket := range data.Buckets {
		html += `<div class="bucket-item">
			<strong>` + bucket.Name + `</strong> (Created: ` + bucket.CreationDate + `)
			<a href="/bucket/` + bucket.Name + `">View</a>
		</div>`
	}
	html += `</div>
	</body>
	</html>
	`

	w.Write([]byte(html))
}

func renderBucketHTML(w http.ResponseWriter, data BucketPageData) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	html := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>S3 Bucket: ` + data.BucketName + `</title>
		<style>
			body { font-family: Arial, sans-serif; margin: 20px; }
			h1 { color: #333; }
			.breadcrumb { margin: 10px 0; }
			.breadcrumb a { margin: 0 5px; }
			.search-box { margin: 20px 0; }
			.object-list { margin-top: 20px; }
			.object-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
			.folder { font-weight: bold; }
		</style>
	</head>
	<body>
		<h1>Bucket: ` + data.BucketName + `</h1>
		<a href="/">Back to Buckets</a>
	`

	if data.Error != "" {
		html += `<div style="color: red;">Error: ` + data.Error + `</div>`
	}

	html += `<div class="breadcrumb">`
	for _, bc := range data.Breadcrumbs {
		if bc.Path == "" {
			html += `<a href="/bucket/` + data.BucketName + `">` + bc.Name + `</a> /`
		} else {
			html += `<a href="/bucket/` + data.BucketName + `?prefix=` + bc.Path + `">` + bc.Name + `</a> /`
		}
	}
	html += `</div>`

	html += `
	<div class="search-box">
		<form method="get">
			<input type="hidden" name="prefix" value="` + data.Prefix + `">
			<input type="text" name="search" placeholder="Search...">
			<button type="submit">Search</button>
		</form>
	</div>

	<div class="object-list">`

	for _, obj := range data.Objects {
		if obj.IsFolder {
			nextPrefix := path.Join(data.Prefix, obj.Name)
			html += `<div class="object-item folder">
				📁 <a href="/bucket/` + data.BucketName + `?prefix=` + url.QueryEscape(nextPrefix) + `">` + obj.Name + `</a>
			</div>`
		} else {
			html += `<div class="object-item">
				📄 <a href="/object/` + data.BucketName + `/` + url.QueryEscape(obj.Key) + `">` + obj.Name + `</a>
				(` + service.FormatFileSize(obj.Size) + `) - ` + obj.LastModified + `
			</div>`
		}
	}

	html += `
	</div>
	</body>
	</html>
	`

	w.Write([]byte(html))
}

func renderObjectHTML(w http.ResponseWriter, data ObjectDetailPageData) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	html := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Object: ` + data.ObjectKey + `</title>
		<style>
			body { font-family: Arial, sans-serif; margin: 20px; }
			h1 { color: #333; }
			.detail-table { border-collapse: collapse; margin: 20px 0; }
			.detail-table th, .detail-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
			.detail-table th { background-color: #f0f0f0; }
		</style>
	</head>
	<body>
		<h1>Object Details: ` + data.ObjectKey + `</h1>
		<a href="/bucket/` + data.BucketName + `">Back to Bucket</a>
	`

	if data.Error != "" {
		html += `<div style="color: red;">Error: ` + data.Error + `</div>`
	} else if data.Detail != nil {
		html += `
		<table class="detail-table">
			<tr>
				<th>Property</th>
				<th>Value</th>
			</tr>
			<tr>
				<td>File Size</td>
				<td>` + data.FormattedSize + ` (` + fmt.Sprintf("%d", data.Detail.Size) + ` bytes)</td>
			</tr>
			<tr>
				<td>Content-Type</td>
				<td>` + data.Detail.ContentType + `</td>
			</tr>
			<tr>
				<td>Last Modified</td>
				<td>` + data.Detail.LastModified + `</td>
			</tr>
			<tr>
				<td>ETag</td>
				<td>` + data.Detail.ETag + `</td>
			</tr>
			<tr>
				<td>Storage Class</td>
				<td>` + data.Detail.StorageClass + `</td>
			</tr>
		</table>
		`
	}

	html += `
	</body>
	</html>
	`

	w.Write([]byte(html))
}
