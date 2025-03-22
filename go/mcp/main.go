package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

const (
	address = "127.0.0.1:8080"
)

// MPCサーバー情報
type ServerInfo struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

// ツール情報
type Tool struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	InputSchema interface{} `json:"inputSchema,omitempty"`
}

// リソース情報
type Resource struct {
	URI         string `json:"uri"`
	Name        string `json:"name"`
	MimeType    string `json:"mimeType,omitempty"`
	Description string `json:"description,omitempty"`
}

// レスポンス構造体
type ListToolsResponse struct {
	Tools []Tool `json:"tools"`
}

type ListResourcesResponse struct {
	Resources []Resource `json:"resources"`
}

type CallToolRequest struct {
	Name      string      `json:"name"`
	Arguments interface{} `json:"arguments"`
}

type CallToolResponse struct {
	Content []ContentItem `json:"content"`
	IsError bool          `json:"isError,omitempty"`
}

type ContentItem struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ReadResourceRequest struct {
	URI string `json:"uri"`
}

type ReadResourceResponse struct {
	Contents []ResourceContent `json:"contents"`
}

type ResourceContent struct {
	URI      string `json:"uri"`
	MimeType string `json:"mimeType"`
	Text     string `json:"text"`
}

// エラーレスポンス
type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// MPCサーバーの実装
type MPCServer struct {
	info      ServerInfo
	tools     []Tool
	resources []Resource
}

// 新しいMPCサーバーを作成
func NewMPCServer() *MPCServer {
	return &MPCServer{
		info: ServerInfo{
			Name:    "example-mpc-server",
			Version: "0.1.0",
		},
		tools: []Tool{
			{
				Name:        "hello",
				Description: "挨拶を返すシンプルなツール",
				InputSchema: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"name": map[string]interface{}{
							"type":        "string",
							"description": "挨拶する相手の名前",
						},
					},
				},
			},
		},
		resources: []Resource{
			{
				URI:         "example://info",
				Name:        "サーバー情報",
				MimeType:    "application/json",
				Description: "このサーバーに関する基本情報",
			},
		},
	}
}

// JSONレスポンスを送信するヘルパー関数
func sendJSONResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("JSONエンコードエラー: %v", err)
	}
}

// エラーレスポンスを送信するヘルパー関数
func sendErrorResponse(w http.ResponseWriter, status int, code int, message string) {
	sendJSONResponse(w, status, ErrorResponse{
		Code:    code,
		Message: message,
	})
}

// ツール一覧ハンドラー
func (s *MPCServer) handleListTools(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendErrorResponse(w, http.StatusMethodNotAllowed, 405, "Method not allowed")
		return
	}

	sendJSONResponse(w, http.StatusOK, ListToolsResponse{
		Tools: s.tools,
	})
}

// ツール実行ハンドラー
func (s *MPCServer) handleCallTool(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendErrorResponse(w, http.StatusMethodNotAllowed, 405, "Method not allowed")
		return
	}

	var req CallToolRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, http.StatusBadRequest, 400, "Invalid request format")
		return
	}

	// ツール名の検証
	if req.Name != "hello" {
		sendErrorResponse(w, http.StatusNotFound, 404, fmt.Sprintf("Tool '%s' not found", req.Name))
		return
	}

	// 引数の取得（型アサーションが必要）
	args, ok := req.Arguments.(map[string]interface{})
	if !ok {
		sendErrorResponse(w, http.StatusBadRequest, 400, "Invalid arguments format")
		return
	}

	// 名前の取得
	name, ok := args["name"].(string)
	if !ok {
		name = "World" // デフォルト値
	}

	// レスポンスの作成
	response := CallToolResponse{
		Content: []ContentItem{
			{
				Type: "text",
				Text: fmt.Sprintf("Hello, %s!", name),
			},
		},
	}

	sendJSONResponse(w, http.StatusOK, response)
}

// リソース一覧ハンドラー
func (s *MPCServer) handleListResources(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendErrorResponse(w, http.StatusMethodNotAllowed, 405, "Method not allowed")
		return
	}

	sendJSONResponse(w, http.StatusOK, ListResourcesResponse{
		Resources: s.resources,
	})
}

// リソース読み取りハンドラー
func (s *MPCServer) handleReadResource(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendErrorResponse(w, http.StatusMethodNotAllowed, 405, "Method not allowed")
		return
	}

	var req ReadResourceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, http.StatusBadRequest, 400, "Invalid request format")
		return
	}

	// URIの検証
	if req.URI != "example://info" {
		sendErrorResponse(w, http.StatusNotFound, 404, fmt.Sprintf("Resource '%s' not found", req.URI))
		return
	}

	// サーバー情報をJSONとして返す
	infoJSON, err := json.Marshal(s.info)
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, 500, "Failed to encode server info")
		return
	}

	response := ReadResourceResponse{
		Contents: []ResourceContent{
			{
				URI:      req.URI,
				MimeType: "application/json",
				Text:     string(infoJSON),
			},
		},
	}

	sendJSONResponse(w, http.StatusOK, response)
}

func main() {
	mpcServer := NewMPCServer()
	server := http.NewServeMux()

	// MPCエンドポイントの登録
	server.HandleFunc("/list_tools", mpcServer.handleListTools)
	server.HandleFunc("/call_tool", mpcServer.handleCallTool)
	server.HandleFunc("/list_resources", mpcServer.handleListResources)
	server.HandleFunc("/read_resource", mpcServer.handleReadResource)

	fmt.Printf("MPCサーバーを起動しています: %s\n", address)
	if err := http.ListenAndServe(address, server); err != nil {
		log.Fatalf("サーバー起動エラー: %v", err)
	}
}
