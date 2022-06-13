// 快排思想：
// 1. 取基准值（根据自己喜好，可以取任何一个，这里取第一个）
// 2. 比基准值小的元素放到基准值左边，比基准值大的放到基准值右边
// 3. 然后对左右两边的元素递归 1、2 步骤

// ------
// 具体实现 1：
// 1. 去第一个数字为基准值，保存到单独的变量中，因此该位置空出来可以用来保存交换过来的值
// 2. 优先从对策开始往中间遍历（取的左边第一个，因此从右边开始），如果右边出现比基准值小的元素则将其和左边空出来的位置交换，然后改变方向
// 3. 现在开始从左边往右遍历，如果左边的值出现比基准值大的元素，则和右边空出来的位置交换，然后改变方向
// 4. 当左右相遇，说明交换完成，此时相遇的位置即使基准值的位置（它左边的元素都比它小，右边的元素都比它大）
function quickSort1(arr, left = 0, right = arr.length - 1) {

    if (left >= right) return;

    // 由于复用数组，因此需要排序的起始坐标和结束坐标
    const arrStart = left,
        arrEnd = right;

    // 取第一个值作为基准值
    const pivot = arr[left]

    // 从左往右还是从右往左
    let leftToRight = false;

    while (true) {
        // 双端聚拢到中间，说明两边交换完成，将基准值放到中间
        // 此时左边的比基准值小，右边的比基准值大
        if (left >= right) {
            arr[left] = pivot
            break;
        };
        if (leftToRight) {
            // 从左往右
            if (arr[left] <= pivot) {
                // 如果左边的值比基准值小就一直往右判断
                left++
            } else {
                // 交换左右的值，此时左边的值已经放到右边，左边这个值空余出来了，left 并不加1，用于下一次右边的值交换到该位置保存
                swap(arr, left, right)
                right--
                // 调整遍历方向
                leftToRight = !leftToRight
            }
        } else {
            // 从右往左
            if (arr[right] >= pivot) {
                // 如果右边的值比基准值大，则往左聚拢
                right--;
            } else {
                // 否则说明右边的值比基准值小，交换左右的值
                swap(arr, left, right)
                left++
                // 调谑方向
                leftToRight = !leftToRight
            }
        }
    }

    // 递归基准值左边的数组
    quickSort1(arr, arrStart, left - 1)
    // 递归基准值右边的数组
    quickSort1(arr, left + 1, arrEnd)
    return arr
}

function swap(arr, i1, i2) {
    arr[i1] = arr[i1] ^ arr[i2]
    arr[i2] = arr[i1] ^ arr[i2]
    arr[i1] = arr[i1] ^ arr[i2]
    return arr;
}


// 具体实现 2：
// 
function quickSort2(arr, start, end) {

    const pivot = arr[start];
    let small = start;
    for (let i = start + 1; i <= end; i++) {
        if (arr[i] < pivot) {
            arr[small] = arr[i];
            small++
        }
    }
    small++
    swap(arr, small, end)

    // quickSort2(arr, )
}