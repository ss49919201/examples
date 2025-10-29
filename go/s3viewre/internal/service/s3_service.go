package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	client *s3.Client
}

type Bucket struct {
	Name             string
	CreationDate     string
	Region           string
}

type Object struct {
	Key          string
	Name         string
	Size         int64
	LastModified string
	IsFolder     bool
	Type         string
}

type ObjectDetail struct {
	Key              string
	Size             int64
	ContentType      string
	LastModified     string
	ETag             string
	StorageClass     string
}

func NewS3Service(client *s3.Client) *S3Service {
	return &S3Service{
		client: client,
	}
}

// ListBuckets はアクセス可能なバケット一覧を取得
func (s *S3Service) ListBuckets(ctx context.Context) ([]Bucket, error) {
	result, err := s.client.ListBuckets(ctx, &s3.ListBucketsInput{})
	if err != nil {
		return nil, fmt.Errorf("failed to list buckets: %w", err)
	}

	var buckets []Bucket
	for _, b := range result.Buckets {
		createdDate := ""
		if b.CreationDate != nil {
			createdDate = b.CreationDate.Format("2006-01-02")
		}

		bucket := Bucket{
			Name:         aws.ToString(b.Name),
			CreationDate: createdDate,
			Region:       "unknown", // リージョンはHeadBucketで取得可能
		}
		buckets = append(buckets, bucket)
	}

	return buckets, nil
}

// ListObjects はバケット内のオブジェクト一覧を取得
func (s *S3Service) ListObjects(ctx context.Context, bucketName, prefix, searchKeyword string) ([]Object, error) {
	// ListObjectsV2を使用
	params := &s3.ListObjectsV2Input{
		Bucket:    aws.String(bucketName),
		Prefix:    aws.String(prefix),
		Delimiter: aws.String("/"),
	}

	result, err := s.client.ListObjectsV2(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to list objects: %w", err)
	}

	var objects []Object

	// フォルダ（共通プレフィックス）を追加
	for _, cp := range result.CommonPrefixes {
		folderName := aws.ToString(cp.Prefix)
		// 最後の / を除去して表示名を作成
		displayName := strings.TrimSuffix(folderName, "/")
		// プレフィックスから最後の部分のみを表示
		if strings.Contains(displayName, "/") {
			displayName = displayName[strings.LastIndex(displayName, "/")+1:]
		}

		obj := Object{
			Key:      folderName,
			Name:     displayName + "/",
			IsFolder: true,
			Type:     "folder",
		}

		// 検索キーワードがある場合はフィルタリング
		if searchKeyword == "" || strings.Contains(displayName, searchKeyword) {
			objects = append(objects, obj)
		}
	}

	// オブジェクト（ファイル）を追加
	for _, obj := range result.Contents {
		key := aws.ToString(obj.Key)
		// プレフィックスと同じ場合（フォルダ自体）はスキップ
		if key == prefix {
			continue
		}

		// ファイル名を抽出
		fileName := key
		if strings.Contains(key, "/") {
			fileName = key[strings.LastIndex(key, "/")+1:]
		}

		lastModified := ""
		if obj.LastModified != nil {
			lastModified = obj.LastModified.Format("2006-01-02 15:04:05")
		}

		objData := Object{
			Key:          key,
			Name:         fileName,
			Size:         aws.ToInt64(obj.Size),
			LastModified: lastModified,
			IsFolder:     false,
			Type:         "file",
		}

		// 検索キーワードがある場合はフィルタリング
		if searchKeyword == "" || strings.Contains(fileName, searchKeyword) {
			objects = append(objects, objData)
		}
	}

	return objects, nil
}

// GetObjectDetail はオブジェクトの詳細情報を取得
func (s *S3Service) GetObjectDetail(ctx context.Context, bucketName, objectKey string) (*ObjectDetail, error) {
	result, err := s.client.HeadObject(ctx, &s3.HeadObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get object detail: %w", err)
	}

	lastModified := ""
	if result.LastModified != nil {
		lastModified = result.LastModified.Format("2006-01-02 15:04:05")
	}

	storageClass := "STANDARD"
	if result.StorageClass != "" {
		storageClass = string(result.StorageClass)
	}

	detail := &ObjectDetail{
		Key:          objectKey,
		Size:         aws.ToInt64(result.ContentLength),
		ContentType:  aws.ToString(result.ContentType),
		LastModified: lastModified,
		ETag:         aws.ToString(result.ETag),
		StorageClass: storageClass,
	}

	return detail, nil
}

// FormatFileSize はバイト数を見やすいサイズに変換
func FormatFileSize(size int64) string {
	const (
		byte     = 1
		kilobyte = byte * 1024
		megabyte = kilobyte * 1024
		gigabyte = megabyte * 1024
	)

	switch {
	case size < kilobyte:
		return fmt.Sprintf("%dB", size)
	case size < megabyte:
		return fmt.Sprintf("%.2fKB", float64(size)/float64(kilobyte))
	case size < gigabyte:
		return fmt.Sprintf("%.2fMB", float64(size)/float64(megabyte))
	default:
		return fmt.Sprintf("%.2fGB", float64(size)/float64(gigabyte))
	}
}
