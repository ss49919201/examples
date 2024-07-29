// 格納したオブジェクトを取り出す
// この時のオブジェクトはライフサイクルでいう中期であり、再構成されたオブジェクトである
// 追加、更新、削除、読み込みをカプセル化することで、呼び出し側からはオブジェクトがメモリ上に存在するかのように使える
//
// Q.なぜリポジトリパターンを使うのか？
// A.①ドメインモデル中心の設計をするため。
// SQLやDBを意識してしまうことで、データ中心の設計に焦点が当たってしまう。集約やオブジェクトを迂回してデータを直接操作したくなってしまう。
// 具体的なDB操作を制限して集約から辿ることを強制することで、
// ドメインロジックがクエリやDB操作呼び出しコードに分散したり集約のカプセル化違反が起こることを防ぐ。また、呼び出し元が複雑になることも防げる。
// ②テストをしやすくするため。
// DBじゃなくてインメモリを使うように差し替えることで、テストをしやすくすることができる。

type User = {
  id: number;
  name: string;
};

type Schedule = {
  id: number;
  name: string;
  from: Date;
  to: Date;

  participantIds: number[]; // User.id
};

type UserRepository = {
  findById: (id: number) => User | undefined;
  save: (user: User) => void;
};

type ScheduleRepository = {
  findById: (id: number) => Schedule | undefined;
  findByParticipantId: (id: number) => Array<Schedule>;
  save: (schedule: Schedule) => void;
};
