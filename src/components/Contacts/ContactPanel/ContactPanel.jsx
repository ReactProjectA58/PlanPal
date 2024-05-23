import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  MinusToggle,
  Plus,
  PlusToggle,
} from "../../../common/helpers/icons";

export default function ContactPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);

  const toggleCollapsePlus = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleCollapseArrow = () => {
    setIsArrowUp((prev) => !prev);
  };

  return (
    <div>
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
              //   {...register("title")}
            />
            <Plus />
          </div>
        </div>
      </div>
    </div>
  );
}
