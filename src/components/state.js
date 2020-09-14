var whatDrag = null;
var prevNode = null;

export function state(newDrag) {
    if(newDrag === undefined) {
        return whatDrag;
    }
    whatDrag = newDrag;
    return whatDrag;
}

// export function prevNode (node, start) {
//     if(node === undefined) {
//         return prevNode;
//     }
//     prevNode = node
// }