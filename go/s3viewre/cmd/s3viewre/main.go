package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/example/s3viewre/internal/handler"
	"github.com/example/s3viewre/internal/service"
)

func main() {
	// AWS SDK 設定
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatalf("AWS config load failed: %v", err)
	}

	// S3 クライアント作成
	s3Client := s3.NewFromConfig(cfg)

	// S3 サービス層作成
	s3Svc := service.NewS3Service(s3Client)

	// ハンドラー層作成
	h := handler.NewHandler(s3Svc)

	// HTTP ルーティング設定
	http.HandleFunc("/", h.HandleHome)
	http.HandleFunc("/bucket/", h.HandleBucket)
	http.HandleFunc("/object/", h.HandleObject)

	// 静的ファイルの提供
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
