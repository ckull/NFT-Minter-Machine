import styled from "styled-components";
import collectionBg from "../../assets/friendly-skull-collection.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  #body {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)),
      url(${collectionBg});
    background-repeat: repeat;
    background-size: contain;
    padding: 1.5rem;
  }

  #box {
    background-color: white;
    border-radius: 20px;
    width: 100%;
    min-height: 400px;
    max-width: 800px;
  }

  #middle-ellipsis {
    span {
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;

      :first-child {
        max-width: 400px;
        text-overflow: ellipsis;
      }
    }
  }

  .info-box {
    width: 100%;
    border: 2px solid #bae7ff;
    border-radius: 20px;
  }

  .avatar {
    border-radius: 50%;
  }
`;

export default Container;
