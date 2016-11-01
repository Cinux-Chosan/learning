sSibling(item1, item2) {
  let $i1 = $(item1),
    $i2 = $(item2),
    $iSiblings = $i1.siblings(),
    sibling = $iSiblings.filter($i2);
  if(sibling && sibling.length) {
    return true;
  }
  return false;
}
