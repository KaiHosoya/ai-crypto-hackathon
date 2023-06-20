import axios from "axios";

export const CreateTableOfContents = async(theme) => {
  const data = {
    "theme": theme,
  }
  const res = await axios.post('http://3.113.10.240/api/tbl_of_contents/', data)
    .then((response) => {
      const data = response.data;
      console.log("data: ", data)
      console.log("data: error");
      return {
        "id": data.id,
        "contents": data.table_of_contents,
      };
    }
    )
    .catch((error) => {
      console.log("error:" ,error);
    }
    )
  console.log("res: ", res);
  return res
}

export const CreateContent = async(item, id, speaker) => {
  const data ={
    "id": id,
    "content": item,
    // "speaker_id": "test",
    "speaker_id": speaker,
  }

  const res = await axios.post('http://3.113.10.240/api/content/generate/', data)
    .then((response) => {
      console.log(response);
      return response;
    }
    )
    .catch((error) => {
      console.log(error);
    }
    )
  return res
}