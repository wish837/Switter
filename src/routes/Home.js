import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Sweet from "components/Sweet";

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    useEffect(() => {
        dbService.collection("sweets").onSnapshot((snapshot) => {
            const sweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setSweets(sweetArray);
        });
    }, []);
    const onSubmit = async(event) => {
        event.preventDefault();
        await dbService.collection("sweets").add({
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setSweet("");
    };
    const onChange = (event) => {
        const { 
            target: { value }, 
        } = event;
        setSweet(value);
    };
    const onFileChange = (event) => {
        const { 
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            console.log(finishedEvent)
        }
        reader.readAsDataURL(theFile);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={sweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={280}
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Sweet" />
            </form>
            <div>
                {sweets.map((sweet) => (
                    <Sweet
                        key={sweet.id}
                        sweetObj={sweet}
                        isOwner={sweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;