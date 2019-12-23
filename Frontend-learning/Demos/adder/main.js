function add(...args) {
    const push = (...moreArgs) => {
        [].push.apply(args, moreArgs)
        return push
    }
    push.toString = () => {
        return args.reduce((prev, next) => prev + next, 0)
    }
    return push
}

add(1)(2, 3)(4)  // f 10

