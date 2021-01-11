class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

//   class ImageControl implements SelectableControl {
//   Class 'ImageControl' incorrectly implements interface 'SelectableControl'.
//     Types have separate declarations of a private property 'state'.
//     private state: any;
//     select() {}
//   }
