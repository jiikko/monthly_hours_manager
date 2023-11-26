import { Row, Col } from "react-bootstrap";

type Props = {};

export const AboutWithoutSetting: React.FC<Props> = () => {
  return (
    <>
      <Row className="mb-3">
        月の時間を管理するアプリケーションです。
        <br />
        <a
          href="https://zenn.dev/jiikko/articles/43ee218a624a6a"
          target="_blank"
          className="text-decoration-underline"
        >
          詳細はこちら
        </a>
      </Row>

      <Row>
        <Col>
          <h2>機能説明</h2>
          <ol>
            <li>
              複数のカレンダーを作成して、案件ごとの稼働時間を管理できます
            </li>
          </ol>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2>更新履歴</h2>
          <ul>
            <li>
              2023/09/20:
              ログインすると複数のカレンダーを登録できるようになりました
            </li>
            <li>2023/09/3: 認証機能, クラウド保存機能の公開</li>
            <li>2023/08/15: リリース</li>
          </ul>
        </Col>
      </Row>
    </>
  );
};
