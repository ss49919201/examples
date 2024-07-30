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
//
// コレクション指向、永続化指向がある
// コレクション指向では、データの更新後に再度保存する処理は必要ないが、リポジトリの実装が複雑になる
//
// リポジトリは集約のルートを返すのが一般的だが、それ以外を返す振る舞いを提供しても良い。
// (特定の条件に合致する集約、集約のルート以外のオブジェクト、件数を返す)
// これらを採用する背景には、パフォーマンスのボトルネックを解消することがあると思うが、多用は避けるべき。クライアントの利便性の為だけに採用するべきではない。
// システムのユースケースとして複数の集約(もしくはその一部)をマージした値が欲しい場合もある。その場合に複数のリポジトリを呼び出して値を組み立てるのではなく、値オブジェクトとして扱いリポジトリから返す。
// 集約ではなく値オブジェクトを返すメソッドは、件数を返すようなメソッドの延長線上にあるものなので許容してもよい。呼び出し元の要件に従って返す値が複雑になっただけである。
// もし、値オブジェクトの返却を多用するようになったら集約の設計を見直す必要がある兆候かもしれない。集約の境界が間違っていないようならCQRSを検討する。

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

type SchedulesWithParticipantNames = {
  schedules: {
    [id: number]: {
      scheduleName: string;
      participantNames: string[];
    };
  };
};

// 永続化指向
type UserRepository = {
  findById: (id: number) => User | undefined;
  save: (user: User) => void;
};

// コレクション指向
type ScheduleRepository = {
  findById: (id: number) => Schedule | undefined;
  findByParticipantId: (id: number) => Array<Schedule>;
  add: (schedule: Schedule) => void;
  remove: (schedule: Schedule) => void;

  // ユースケース特化の値オブジェクトを返す
  findSchedulesWithParticipantNames: (
    participantId: number
  ) => SchedulesWithParticipantNames;
};
