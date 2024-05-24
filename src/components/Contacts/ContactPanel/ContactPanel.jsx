import { useContext, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  MinusToggle,
  Plus,
  PlusToggle,
} from "../../../common/helpers/icons";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../context/AppContext";
import { createContactList } from "../../../services/contacts.service";

export default function ContactPanel() {
  const { userData } = useContext(AppContext);
  const { handleSubmit, register, reset } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);

  const onSubmit = (data) => {
    const { title } = data;
    createContactList(title, userData?.handle);
    reset();
  };

  const toggleCollapsePlus = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleCollapseArrow = () => {
    setIsArrowUp((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="collapse bg-base-200 mb-2">
        <input
          type="checkbox"
          checked={isArrowUp}
          onChange={toggleCollapseArrow}
        />
        <div className="flex justify-between collapse-title text-xl font-medium">
          <label className="swap">
            <input type="checkbox" checked={isArrowUp} readOnly />
            {isArrowUp ? <ArrowUp /> : <ArrowDown />}
          </label>
          <span>Contact Lists</span>
        </div>
        <div className="collapse-content">
          <p>Some contacts bla bla bla</p>
        </div>
      </div>

      <div>
        <div className="collapse bg-base-200">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={toggleCollapsePlus}
          />

          <div className="flex justify-between collapse-title text-xl font-medium ">
            <span>Create New Contact List</span>{" "}
            <label className="swap">
              <input type="checkbox" checked={isOpen} readOnly />
              {isOpen ? <MinusToggle /> : <PlusToggle />}
            </label>
          </div>
          <div className="collapse-content">
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
          </div>
        </div>
      </div>
    </form>
  );
}
