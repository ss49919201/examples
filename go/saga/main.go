package main

// RDB
func begin() error
func rollback() error
func commit() error
func insertToRDB() error

// DynamoDB
func putToDynamoDB() error
func deleteFromDynamoDB() error

// SQS
func enqueue() error

// もし rollback() だけ失敗したら？
// もし deleteFromDynamoDB() だけ失敗したら？
// enqueue() のロールバックは？
func ng() {
	begin()
	var err error
	defer func() {
		if err != nil {
			rollback()
			deleteFromDynamoDB()
		}
	}()
	err = insertToRDB()
	if err != nil {
		return
	}
	err = putToDynamoDB()
	if err != nil {
		return
	}
	err = enqueue()
	if err != nil {
		return
	}
	commit()
}

// insertToRDB よりも後ろで失敗した場合は運用で対応
func better() {
	begin()
	if err := insertToRDB(); err != nil {
		rollback()
		return
	}
	commit()

	if err := putToDynamoDB(); err != nil {
		return
	}

	if err := enqueue(); err != nil {
		return
	}
}

// ロールバックも失敗した場合は運用で対応
func saga() {
	rollbacks := make([]func() error, 0)
	defer func() {
		for _, rollback := range rollbacks {
			rollback()
		}
	}()

	begin()
	if err := insertToRDB(); err != nil {
		return
	}
	commit()
	rollbacks = append(rollbacks, rollback)

	if err := putToDynamoDB(); err != nil {
		return
	}
	rollbacks = append(rollbacks, deleteFromDynamoDB)

	if err := enqueue(); err != nil {
		return
	}
	rollbacks = append(rollbacks, enqueue)
}
