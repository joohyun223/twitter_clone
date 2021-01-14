import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({nweetObj , isOwner})=>{
    //수정모드
    const [editing, setEditing] = useState(false);
    //텍스트 업데이트
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async ()=>{
        const ok = window.confirm('Are you sure you want to delete this nweet?');
        console.log(ok);
        if(ok){
            //delete nweet
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = ()=> setEditing((prev)=>!prev);
    const onSubmit = async (event)=>{
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text : newNweet,
        })
        setEditing(false);
    }
    const onChange = (event)=>{
        const {
            target: {value},
        } = event;
        setNewNweet(value);
    }
    return(
        <div>
            {editing ? (
                <>
                    {isOwner &&
                        <>
                            <form onSubmit={onSubmit}>
                                <input value={newNweet} placeholder="수정내용" value={newNweet} required onChange={onChange} />
                                <input type="submit" value="Update Nweet" />
                            </form>
                            <button onClick={toggleEditing}>cancel</button>
                        </>
                    }
                </>
            ) : (
                    <button>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px"/>}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                                <button onClick={toggleEditing}>Edit Nweet</button>
                            </>
                        )}
                    </button>
                )
            }
        </div>
    )
};

export default Nweet;