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

  const createDom = (fiber) => {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    Object.keys(fiber.props)
      .filter((key) => key !== "children")
      .forEach((name) => {
        dom[name] = fiber.props[name];
      });

    return dom;
  };

  // nextUnitOfWorkをfiberツリーのルートに設定する
  const render = (element, container) => {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
    };

    nextUnitOfWork = wipRoot;
  };

  const Seact = {
    createElement,
    render,
  };

  const performUnitWork = (fiber) => {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }

    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
      const element = elements[index];

      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null,
      };

      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }

    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  };

  let wipRoot = null;
  let nextUnitOfWork = null;

  const commitWork = (fiber) => {
    if (!fiber) return;

    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  };

  // 仮装DOMをDOMに反映する
  const commitRoot = () => {
    commitWork(wipRoot.child);
    wipRoot = null;
  };

  const workLoop = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }

    requestIdleCallback(workLoop);
  };

  requestIdleCallback(workLoop);

  const element = Seact.createElement(
    "div",
    { id: "foo" },
    Seact.createElement("a", null, "bar"),
    Seact.createElement("b")
  );

  // bable に jsx を変換する際に、Seact.createElement を使わせる
  /** @jsx Seact.createElement */
  const elementForJsx = (
    <div id="foo">
      <a>bar</a>
      <b />
    </div>
  );

  const container = document.getElementById("root");
  Seact.render(elementForJsx, container);
}
