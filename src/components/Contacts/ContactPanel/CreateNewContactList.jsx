import { useContext } from "react";
import { Plus } from "../../../common/helpers/icons";
import { createContactList } from "../../../services/contacts.service";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../context/AppContext";

export default function CreateNewContactList() {
  const { userData } = useContext(AppContext);
  const { handleSubmit, register, reset } = useForm();

  const onSubmit = (data) => {
    const { title } = data;
    createContactList(title, userData?.handle);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="input input-bordered h-min"
        placeholder="My Colleagues"
        type="text"
        {...register("title")}
      />
      <button type="submit">
        {" "}
        <Plus />
      </button>
    </form>
  );
}