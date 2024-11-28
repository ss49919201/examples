const arg = process.argv[2];

if (arg === "1") {
  /*
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root");
SeactDOM.render(element, container);
*/

  /*
const element = Seact.CreateElement("h1", { title: "foo" }, "Hello"); // メイン処理はオブジェクトの作成
*/

  const element = {
    /**
     * DOMノードのタイプ
     */
    type: "h1",
    props: {
      title: "foo",
      children: "Hello",
    },
  };

  const node = document.createElement(element.type);
  node["title"] = element.props.title;
  const text = document.createTextNode("");
  text["nodeValue"] = element.props.children;

  const container = document.getElementById("root");
  node.appendChild(text);
  container.appendChild(node);
} else if (arg === "2") {
  const createTextElement = (text) => {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    };
  };

  const createElement = (type, props, ...children) => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === "object" ? child : createTextElement(child)
        ), // 配列
      },
    };
  };

  console.log(createElement("div"));
  console.log(JSON.stringify(createElement("div", null, "a", "b")));

  const Seact = {
    createElement,
  };

  const element = Seact.createElement(
    "div",
    { id: "foo" },
    Seact.createElement("a", null, "bar"),
    Seact.createElement("b")
  );
  console.log(JSON.stringify(element));

  // bable に jsx を変換する際に、Seact.createElement を使わせる
  /** @jsx Seact.createElement */
  const elementForJsx = (
    <div id="foo">
      <a>bar</a>
      <b />
    </div>
  );
}
