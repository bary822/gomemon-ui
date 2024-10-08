import { useEffect, useState } from 'react'
import './App.css'
import logoUrl from './assets/gomemon_logo.png'
import { GomemonMemoClient } from './client/gomemon_memo_client'
import { Memo } from './types/memo'

function Logo({imagePath}: {imagePath: string}) {
  return (
    <img
      src={imagePath}
      className='logo'
    />
  )
}

function MemoWrapper() {
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedMemos = await GomemonMemoClient.getAllMemos();
      setMemos(fetchedMemos);
    })();
  }, [])

  return (
    <div>
      <CreateMemo setMemos={setMemos}/>
      <MemoList memos={memos} setMemos={setMemos}/>
    </div>
  )
}

function CreateMemo({setMemos}: { setMemos: React.Dispatch<React.SetStateAction<Memo[]>>}) {
  const [input, setInput] = useState<string>('');

  const postMemo = (async () => {
    "use server";
    const content = input.trim();
    if (content !== null) {
      await GomemonMemoClient.createMemo(content);
      const fetchedMemos = await GomemonMemoClient.getAllMemos();
      setMemos(fetchedMemos);
      setInput('');
    }
  });

  return (
    <>
      <div className="mb-3">
        <textarea
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここにメモを書く..."
          rows={5}
        ></textarea>
      </div>
      <button className="btn btn-pink mb-3" onClick={postMemo}>
        メモを作成
      </button>
    </>
  );
}

function MemoList({memos, setMemos}: { memos: Memo[], setMemos: React.Dispatch<React.SetStateAction<Memo[]>>}) {
  return (
    <div>
      {memos.length === 0 ? (
        <p className="text-muted">メモがありません。作成してみましょう!</p>
      ): (
        memos.map((memo, index) => (
          <MemoEditableContent index={index} memo={memo} setMemos={setMemos} />
        ))
      )}
    </div>
  );
}

function MemoEditableContent({index, memo, setMemos}: { index: number, memo: Memo, setMemos: React.Dispatch<React.SetStateAction<Memo[]>> }) {
  const [isEditing, setIsEditing] = useState<string|null>(null);
  const [editInput, setEditInput] = useState<string>('');

  const deleteMemo = (async () => {
    await GomemonMemoClient.deleteMemo(memo.id);
    const fetchedMemos = await GomemonMemoClient.getAllMemos();
    setMemos(fetchedMemos);
  });

  const editMemo = (async () => {
    setIsEditing(memo.id)
    setEditInput(memo.content);

  });

  const saveMemo = (async () => {
    "use server";
    await GomemonMemoClient.editMemo(memo.id, editInput);

    const fetchedMemos = await GomemonMemoClient.getAllMemos();
    setMemos(fetchedMemos);
    setIsEditing(null);
    setEditInput('');
  });


  return (
    <div className="card" key={index}>
      <div className="card-body d-flex justify-content-between align-items-center">
        {isEditing === memo.id ? (
          // 編集モードの場合
          <textarea
            className="form-control me-3"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            rows={3}
          ></textarea>
        ) : (
          // 通常表示モードの場合
          <span style={{whiteSpace: 'pre-line', textAlign: 'left'}}>{memo.content}</span>
        )}
        <div>
          {isEditing === memo.id ? (
            // 編集モードで表示されるボタン
            <>
              <button
                className="btn btn-success me-2"
                onClick={() => saveMemo()}
              >
                保存
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(null)}
              >
                キャンセル
              </button>
            </>
          ) : (
            // 通常モードで表示されるボタン
            <>
              <button
                className="btn btn-warning me-2"
                onClick={() => editMemo()}
              >
                編集
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteMemo()}
              >
                削除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className='container text-center'>
      <div className='row justify-content-center'>
        <div className='col'>
          <Logo imagePath={logoUrl} />
          <MemoWrapper />
        </div>
      </div>
    </div>
  )
}

export default App
