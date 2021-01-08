import Nweet from 'components/Nweet';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({userObj})=>{
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);


    // 컴포넌트가 화면에 나타날 때
    useEffect(() => {
        //realtime listener
        dbService.collection("nweets").onSnapshot(snapshot=>{
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        })
    }, []);
 
    const onSubmit = async (event)=>{
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
    }; 
    const onChange = (event) => {
        const {target:{ value }} = event;

        setNweet(value);
    }

    return (
        <div>
            <div>
                <form onSubmit={onSubmit}>
                    <input type="text" value={nweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                    <input type="submit" value="Nweet" />
                </form>
            </div>
            <div> 
                {nweets.map(nweet =>
                (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />   
                ))}
            </div>
        </div>
    )
}
export default Home;