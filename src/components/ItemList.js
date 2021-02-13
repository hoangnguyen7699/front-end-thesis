import Item from "./Item/Item";
import "./Item/Item.css";
export default function ItemList(props) {
  return (
    <div className="u-container">
      {props.list.map((e, index) => (
        <Item
          key={`${index}`}
          file={e}
          onDelete={() => props.onDelete(index)}
          delete={props.onDelete!==undefined}
          editName={props.editName}
        />
      ))}
    </div>
  );
}
