

class BTreeNode {
    constructor(value, left, right) {
        this.value = value;
        this.left = left
        this.right = right
    }
}

// 重建二叉树
function buildBTree(preOrder, inOrder) {
    if (!preOrder.length) return
    const rootValue = preOrder[0]
    // 找到根节点在中序中的位置
    const leftCount = inOrder.indexOf(rootValue)
    // 重建左侧树
    const left = buildBTree(preOrder.slice(1, leftCount + 1), inOrder.slice(0, leftCount))
    // 重建右侧树
    const right = buildBTree(preOrder.slice(leftCount + 1), inOrder.slice(leftCount + 1))
    const rootNode = new BTreeNode(rootValue, left, right)
    return rootNode
}

const preOrder = [1, 2, 4, 7, 3, 5, 6, 8] // 前序遍历
const inOrder = [4, 7, 2, 1, 5, 3, 8, 6] // 中序遍历

buildBTree(preOrder, inOrder)