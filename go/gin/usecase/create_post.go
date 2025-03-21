package usecase

type CreateEntryUsecaseDTO struct {
	ID    int
	Title string
	Body  string
}

type CreateEntryUsecase func(userID int, title, body string) (*CreateEntryUsecaseDTO, error)

var _ CreateEntryUsecase = CreateEntry

func CreateEntry(userID int, title, body string) (*CreateEntryUsecaseDTO, error) {
	return nil, nil
}
