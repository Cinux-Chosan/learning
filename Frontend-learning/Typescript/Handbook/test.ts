class Handler {
  info: string;
  onClickGood = (e: Event) => {
    this.info = e.type;
  };
}