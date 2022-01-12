import { createHash, randomUUID } from "crypto";

function createEtag(str) {
  return createHash("md5").update(str).digest("hex");
}

class Data {
  constructor(name) {
    this.id = randomUUID();
    this.name = name;
    this.etag = createEtag(this.name);
  }

  setName(name) {
    this.name = name;
  }

  setEtag() {
    this.etag = createEtag(this.name);
  }
}

const data = new Data("CuckooQ");

export default function handler(req, res) {
  switch (req.method) {
    case "GET": {
      const jsonData = { name: data.name, etag: data.etag };

      if (req.headers.etag === data.etag) {
        console.log("LOG: GET NOT MODIFIED DATA");
        res.status(304).send();
      } else {
        console.log("LOG: GET MODIFIED DATA");
        res.status(200).json(jsonData);
      }
      break;
    }
    case "PUT": {
      console.log("LOG: UPDATE");
      const { name } = JSON.parse(req.body);
      data.setName(name);
      data.setEtag();
      res.status(200).send();
      break;
    }
    default: {
      res.status(405).send();
    }
  }
}
