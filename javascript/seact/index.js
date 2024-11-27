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
