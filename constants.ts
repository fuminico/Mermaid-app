
import { DiagramType } from './types';

export const TEMPLATES: Record<DiagramType, string> = {
  [DiagramType.Flowchart]: `- 受付で申込書を受け取る\n- 次に内容を確認する\n- もし不備あり -> 修正を依頼する\n- もし不備なし -> 受理する\n- 登録処理を行う`,
  [DiagramType.Sequence]: `ユーザー: ログイン画面へアクセス\nサーバー: ログイン画面を表示\nユーザー: IDとパスワードを入力して送信\nサーバー: 認証処理\nサーバー: ユーザーへ認証結果を返す`,
  [DiagramType.Gantt]: `プロジェクト計画\n設計: 2024-10-01, 5d\n開発: 2024-10-06, 10d\nテスト: 2024-10-16, 7d`,
  [DiagramType.Class]: `class Animal\n<<interface>> Animal\nAnimal <|-- Duck\nAnimal <|-- Fish\nAnimal : +String name\nAnimal : +go()`,
  [DiagramType.State]: `[*] --> Still\nStill --> [*]\nStill --> Moving\nMoving --> Still\nMoving --> Crash\nCrash --> [*]`,
};

export const DIAGRAM_TYPE_OPTIONS = [
    { value: DiagramType.Flowchart, label: 'フローチャート' },
    { value: DiagramType.Sequence, label: 'シーケンス図' },
    { value: DiagramType.Gantt, label: 'ガントチャート' },
    { value: DiagramType.Class, label: 'クラス図' },
    { value: DiagramType.State, label: '状態遷移図' },
];
