import { Memo } from "../types/memo";

const API_URL_BASE = import.meta.env.PROD ? "http://api.gomemon.bary822.me:8080" : "http://localhost:8080"

export class GomemonMemoClient {
  public static async getMemoById(id: string): Promise<Memo> {
    const path = `/memos/${id}`;
    const url = API_URL_BASE + path;

    const response = await fetch(url);

    const json = await response.json();
    const memo = new Memo(json.ID, json.Content);

    return memo;
  }

  public static async getAllMemos(): Promise<Memo[]> {
    const path = "/memos";
    const url = API_URL_BASE + path;

    const response = await fetch(url);

    const json = await response.json();
    const memos = new Array<Memo>
    json.Memos.forEach((m: { ID: string; Content: string; }) => {
      const memo = new Memo(m.ID, m.Content);
      memos.push(memo);
    });

    return memos
  }

  public static async createMemo(content: string): Promise<Memo> {
    const path = "/memos"
    const url = API_URL_BASE + path;

    const reqBody = { "content": content }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })

    const json = await response.json();
    const memo = new Memo(json.ID, json.Content);

    return memo;
  }

  public static async deleteMemo(id: string): Promise<boolean> {
    const path = `/memos/${id}`;
    const url = API_URL_BASE + path;

    const response = await fetch(url, {
      method: "DELETE"
    });

    switch (response.status / 100) {
      case 2: // 2XX
        return true
      case 4: // 4XX
        return false
      case 5: // 5XX
        return false
      default:
        return false;
    }
  }

  public static async editMemo(id: string, content: string): Promise<Memo> {
    const path = `/memos/${id}`;
    const url = API_URL_BASE + path;

    const reqBody = { "content": content }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })

    const json = await response.json();
    const memo = new Memo(json.ID, json.Content);

    return memo;
  }

}
