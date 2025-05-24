package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

func main() {
	// エンキューするメッセージ
	wg := sync.WaitGroup{}
	for range 100 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			// AWSの設定を読み込む
			cfg, err := config.LoadDefaultConfig(context.TODO())
			if err != nil {
				log.Fatalf("Unable to load AWS config, %v", err)
			}

			// SQSクライアントを作成
			client := sqs.NewFromConfig(cfg)

			// キューURL（環境変数から取得）
			queueURL := os.Getenv("QUEUE_URL")

			message := "Hello SQS!"
			// メッセージをエンキュー
			input := &sqs.SendMessageInput{
				QueueUrl:    &queueURL,
				MessageBody: &message,
			}

			result, err := client.SendMessage(context.TODO(), input)
			if err != nil {
				log.Fatalf("Failed to send message to SQS, %v", err)
			}
			fmt.Printf("Message sent successfully! Message ID: %s\n", *result.MessageId)
		}()
	}

	wg.Wait()
}
