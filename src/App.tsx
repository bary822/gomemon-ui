import { useEffect, useState } from 'react'
import './App.css'
import { GomemonMemoClient } from './client/gomemon_memo_client'
import { Memo } from './types/memo'

function MemoWrapper() {
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedMemos = await GomemonMemoClient.getAllMemos();
      setMemos(fetchedMemos);
    })();
  }, [])

  return (
    <>
      <MemoList memos={memos} setMemos={setMemos}/>
      <CreateMemo setMemos={setMemos}/>
    </>
  )
}

function MemoList({memos, setMemos}: { memos: Memo[], setMemos: React.Dispatch<React.SetStateAction<Memo[]>>}) {
  return (
    <ul>
      {memos.map((memo, index) => (
        <li key={index}>
          <MemoEditableContent memo={memo} setMemos={setMemos} />
        </li>
      ))}
    </ul>
  )
}

function MemoEditableContent({memo, setMemos}: { memo: Memo, setMemos: React.Dispatch<React.SetStateAction<Memo[]>> }) {
  const [editing, setEditing] = useState<boolean>(false);

  const enableEditing = () => {
    setEditing(true)
  }

  const submitMemoContent = (async (formData: FormData) => {
    "use server";
    const id = formData.get("id");
    const content = formData.get("content");
    if (id !== null && content !== null) {
      await GomemonMemoClient.editMemo(id.toString(), content.toString());
    }

    const fetchedMemos = await GomemonMemoClient.getAllMemos();
    setMemos(fetchedMemos);

    setEditing(false)
  });

  const deleteMemo = (async () => {
    await GomemonMemoClient.deleteMemo(memo.id);
    const fetchedMemos = await GomemonMemoClient.getAllMemos();
    setMemos(fetchedMemos);
  });

  return (
    <>
      { editing
        ? <form action={submitMemoContent}>
            <input type="hidden" name="id" value={memo.id} />
            <input name="content" defaultValue={memo.content} />
            <button style={{margin: '10px'}} type="submit">保存</button>
          </form>
        : <span>
            {memo.content}
            <a 
              style={{marginLeft: '10px', cursor: 'pointer'}} 
              onClick={enableEditing}>
                編集
            </a>
            <a 
              style={{marginLeft: '10px', cursor: 'pointer'}} 
              onClick={deleteMemo}>
                削除
            </a>
          </span>
      }
    </>
  )
}

function CreateMemo({setMemos}: { setMemos: React.Dispatch<React.SetStateAction<Memo[]>>}) {
  const postMemo = (async (formData: FormData) => {
    "use server";
    const content = formData.get("content");
    if (content !== null) {
      await GomemonMemoClient.createMemo(content.toString());
      const fetchedMemos = await GomemonMemoClient.getAllMemos();
      setMemos(fetchedMemos);
    }
  });

  return (
    <form action={postMemo}>
      <input name="content" />
      <button style={{margin: '10px'}} type="submit">作成</button>
    </form>
  );
}

function App() {
  return (
    <div>
      <MemoWrapper />
    </div>
  )
}

export default App
