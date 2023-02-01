import styled from "styled-components";

const PageUpload = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  background-color: white;
  flex-direction: column;
  font-family: Roboto;
`;

const ContainerUpload = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 70%;
  padding: 20;
  margin-top: 25px;
  background-color: #f7f7fa;
  border-radius: 2rem;
`;

const PageChat = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  background-color: white;
  flex-direction: column;
  font-family: Segoe UI Historic;
  color: #374151;
`;

const ContainerChat = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 70%;
  padding: 20;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;


const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 55px;
  max-height: 55px;
  overflow: auto;
  width: 80%;
  border-radius: 10px;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  width: 70%;
  display: flex;
  flex-direction: row;
  border-radius: 1rem;
  box-shadow:  0 0 3px 3px rgba(217,217,227,.8);
  color: #1c1e21;
  margin-bottom: 2rem;
`;


const TextArea = styled.input`
  width: 100%;
  border: none;
  outline: none;w
  line-height: 15px;
  font-size: 1.2rem;
  padding: 1rem;
  background-color: transparent;
  letter-spacing: 1px;
  ::placeholder {
    color: lightgray;
  }
`;

const ButtonBlue = styled.button`
  background-color: blue;
  width: 10%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: px;
  margin: 2px
`;

const SendButton = styled.button`
  border:none;
  width: 20%;
  background-color:transparent;
  color: #410cd9;
  font-size: 20px;
  font-weight: 1rem
`;

const ButtonGrey = styled.button`
  background-color: lightgrey;
  width: 100%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: 17px;
  margin: 2px
`;

const ButtonDrop = styled.button`
  background-color: #410cd9;
  width: 50%;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: 17px;
  margin: 2px
`;


const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  background-color:#410cd9;
  color: #ffffff;
  padding: 1rem;
  text-align: left;
  border-radius: 2rem;
  font-size: 1.2rem;
  line-height:20px;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  background-color:rgba(217,217,227,.8);
  color: #1c1e21;
  padding: 1rem;
  text-align: left;
  border-radius: 2rem;
  font-size: 1.2rem;
  line-height:20px;
`;

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
    border: 2px dashed #d6d6d6;
    margin: 2rem;
    border-radius: 1rem;
    background-color: transparent;
`   


export {
    InnerContainer,
    TextArea,
    ButtonBlue,
    ButtonGrey,
    Form,
    MyRow,
    MyMessage,
    PartnerRow,
    PartnerMessage,
    InputBox,
    ButtonDrop,
    PageUpload,
    ContainerUpload,
    PageChat,
    ContainerChat,
    SendButton
  }