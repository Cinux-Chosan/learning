


const element = React.createElement(
    "div",
    { id: "foo" },
    React.createElement("a", null, "bar"),
    React.createElement("b")
)


function createElement(tag, props, ...children) {

    const dom = document.createElement(tag)

    for (const key in props) {
        if (Object.hasOwnProperty.call(props, key)) {
            const value = props[key];
            dom[key] = value;
        }
    }

    dom.children = children.map(child => createElement(child.tag, child.props, child.children))

    return dom
}