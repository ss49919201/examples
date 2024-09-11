package main

type user struct {
	id          int // 主キー
	name        string
	countryID   int // 主キー
	countryName string
	friendNames []string
	cityID      int
	cityName    string
}

type userNormarize1 struct {
	// 一つの列には一つの値
	friendName string

	id          int // 主キー
	name        string
	countryID   int // 主キー
	countryName string
	cityID      int
	cityName    string
}

type userNormarize2 struct {
	// 一つの列には一つの値
	friendName string

	// 部分関数従属を解消し、完全関数従属にする
	// - countryName は countryID に関数従属している
	// - countryID は候補キーなので、非キー属性の countryName が、候補キーの countryID に関数従属しているので、部分関数従属している
	// 逆操作の「結合」を行えばもとに戻せる
	countryID int // 主キー

	id       int // 主キー
	name     string
	cityID   int
	cityName string
}

type userNormarize3 struct {
	// 一つの列には一つの値
	friendName string

	// 部分関数従属を解消し、完全関数従属にする
	// 逆操作の「結合」を行えばもとに戻せる
	countryID int // 主キー

	// 推移的関数従属を解消
	// - 非キー属性の cityName が、非キー属性の countryName に関数従属しているので、推移的関数従属している
	cityID int
}
