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
      alternate: currentRoot,
    };

    deletion = [];
    nextUnitOfWork = wipRoot;
  };

  const Seact = {
    createElement,
    render,
  };

  const reconcilChildren = (wipFiber, elements) => {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 前回レンダリングしたもの
    let prevSibling = null;

    while (index < elements.length || oldFiber != null) {
      const element = elements[index]; // DOMにレンダリングしたいもの
      let newFiber = null;

      const sameType = oldFiber && element && element.type === oldFiber.type;

      if (sameType) {
        // DOMノードは保持して、propsを更新する
        newFiber = {
          type: oldFiber.type,
          dom: oldFiber.dom,
          props: element.props,
          parent: wipFiber,
          alternate: oldFiber,
          effect: "UPDATE",
        };
      }

      if (element && !sameType) {
        // 新しくDOMノードを作る
        newFiber = {
          type: element.type,
          dom: null,
          props: element.props,
          parent: wipFiber,
          alternate: null,
          effect: "PLACEMENT",
        };
      }

      if (oldFiber && !sameType) {
        // 古いDOMノードを削除する
        oldFiber.effect = "DELETION";
        deletion.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        wipFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  };

  const performUnitWork = (fiber) => {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }

    const elements = fiber.props.children;
    reconcilChildren(fiber, elements);

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
  let deletion = null;

  const isEvent = (key) => key.startsWith("on");
  const isProp = (key) => key !== "children" && !isEvent(key);
  const isGone = (prev, next) => (key) => !(key in next);
  const isNew = (prev, next) => (key) => prev[key] !== next[key];
  const updateDom = (dom, prevProps, nextProps) => {
    // 古いDOMの削除
    Object.keys(prevProps)
      .filter(isProp)
      .filter(isGone(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = "";
      });

    // 新DOMの追加または入れ替え
    Object.keys(nextProps)
      .filter(isProp)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = nextProps[name];
      });

    // イベントハンドラが変更された場合は削除
    Object.keys(prevProps)
      .filter(isEvent)
      .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLocaleLowerCase().substring(2);
        dom.removeEventListner(eventType, prevProps[name]);
      });

    // イベントハンドラを追加
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLocaleLowerCase().substring(2);
        dom.addEventListner(eventType, nextProps[name]);
      });
  };

  const commitWork = (fiber) => {
    if (!fiber) return;

    const domParent = fiber.parent.dom;

    if (fiber.effect === "PLACEMENT" && fiber.dom != null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effect === "UPDATE" && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effect === "DELETION") {
      domParent.removeChild(fiber.dom);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  };

  // 仮装DOMをDOMに反映する
  const commitRoot = () => {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
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
