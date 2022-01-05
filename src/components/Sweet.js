import React, { useState } from "react";
import { dbService } from "fbase";

const Sweet = ({ sweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this sweet?");
        if (ok) {
            await dbService.doc(`sweets/${sweetObj.id}`).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        await dbService.doc(`sweets/${sweetObj.id}`).update({
            text: newSweet
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewSweet(value);
    };
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your sweet"
                            value={newSweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Sweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : ( 
                <>
                    <h4>{sweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Sweet</button>
                            <button onClick={toggleEditing}>Edit Sweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Sweet;