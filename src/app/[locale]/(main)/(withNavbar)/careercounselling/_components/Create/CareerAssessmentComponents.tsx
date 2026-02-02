import SelectButton from "../Buttons/SelectButton";

import {
  careerjourneyselect,
  educationselect,
  engagingselect,
  solveproblemselect,
  importantdecisionsselect,
  hopeselect,
  influencechoiceselect,
  worksettingselect,
  challengeselect,
  approachselect,
} from "@/utils/data";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DraggableButton } from "../Buttons/DraggableButton";
import { CircleCheck } from "lucide-react";

import UpgradeModal from "./Modal/UpgradeModal";
import ModalFooter from "./Modal/ModalFooter";

type DragCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const CareerJourney: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 min-w-[878px] max-w-[1146px] px-1">
      <div className="grid grid-cols-3 grid-rows-2 gap-3">
        {careerjourneyselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-full h-[216px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const Education: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[882px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {educationselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-[211px] h-[176px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const Engaging: React.FC<{
  footer: React.ReactNode;
  selectedCard: number[] | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 min-w-[1000px] max-w-[1146px] px-1">
      <div className="grid grid-cols-3 grid-rows-2 gap-3">
        {engagingselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="checkbox"
            description={card.description}
            className="w-full h-[195px]"
            selected={selectedCard?.includes(index)}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const LongTermGoal: React.FC<{
  footer: React.ReactNode;
  longTermGoals: DragCard[];
  handleOnDragEnd: (result: any) => void;
}> = ({ footer, longTermGoals, handleOnDragEnd }) => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="longtermgoals">
          {(provided) => (
            <ul
              className="flex flex-col gap-3 items-center"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {longTermGoals.map(({ title, description, icon }, index) => {
                return (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <DraggableButton
                          index={index}
                          title={title}
                          description={description}
                          icon={icon}
                          className="w-[542px] h-16"
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div>{footer}</div>
    </div>
  );
};

export const SolveProblem: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[1035px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {solveproblemselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-[318px] h-[194px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const PreferredWorkStyle: React.FC<{
  footer: React.ReactNode;
  workStyleGoals: DragCard[];
  handleOnDragEnd: (result: any) => void;
}> = ({ footer, workStyleGoals, handleOnDragEnd }) => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col items-center">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="longtermgoals">
            {(provided) => (
              <ul
                className="flex flex-col gap-3 items-center"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {workStyleGoals.map(({ title, description, icon }, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DraggableButton
                            index={index}
                            indexHidden={
                              index === 3 || index === 4 || index === 5
                            }
                            title={title}
                            description={description}
                            icon={icon}
                            className="w-[654px] h-16"
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const InfluenceChoice: React.FC<{
  footer: React.ReactNode;
  selectedCard: number[] | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[1148px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {influencechoiceselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="checkbox"
            description={card.description}
            className="w-[278px] h-[196px]"
            selected={selectedCard?.includes(index)}
            disabled={
              selectedCard?.length == 3 && !selectedCard?.includes(index)
            }
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const WorkSetting: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[1048px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {worksettingselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-[252px] h-[216px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const ImportantDecisions: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[888px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {importantdecisionsselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-[288px] h-[194px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const Challenge: React.FC<{
  footer: React.ReactNode;
  selectedCard: number[] | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 w-[1124px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {challengeselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="checkbox"
            description={card.description}
            className="w-[192px] h-[176px]"
            selected={selectedCard?.includes(index)}
            disabled={
              selectedCard?.length == 3 && !selectedCard?.includes(index)
            }
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const Hope: React.FC<{
  footer: React.ReactNode;
  selectedCard: number[] | undefined;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, onSelectCard }) => {
  return (
    <div className="flex flex-col gap-10 min-w-[1062px] max-w-[1152px] px-1">
      <div className="grid grid-cols-4 grid-rows-2 gap-3 justify-center">
        {hopeselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-full h-[196px]"
            selected={selectedCard?.includes(index)}
            disabled={
              selectedCard?.length == 2 && !selectedCard?.includes(index)
            }
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div>{footer}</div>
    </div>
  );
};

export const ApproachSelect: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  onSelectCard: (index: number) => void;
  isModalVisible: boolean;
  handleModal: () => void;
  saveLaterClick: () => void;
  nextClick: () => void;
}> = ({
  footer,
  selectedCard,
  onSelectCard,
  isModalVisible,
  handleModal,
  saveLaterClick,
  nextClick,
}) => {
  return (
    <div className="flex flex-col gap-10 min-w-[773px]">
      <div className="flex flex-wrap gap-3 justify-center">
        {approachselect.map((card, index) => (
          <SelectButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof card.icon === "function"
                ? card.icon({ colorful })
                : card.icon
            }
            title={card.title}
            type="radio"
            description={card.description}
            className="w-[247px] h-[200px]"
            selected={selectedCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      {isModalVisible && (
        <UnlockModal
          isOpen={isModalVisible}
          handleModal={handleModal}
          saveClick={saveLaterClick}
          nextClick={nextClick}
        />
      )}
      <div>{footer}</div>
    </div>
  );
};

const UnlockModal: React.FC<{
  isOpen: boolean;
  handleModal: () => void;
  saveClick: () => void;
  nextClick: () => void;
}> = ({ isOpen, handleModal, saveClick, nextClick }) => {
  const BodyCheckComponent = ({ text }: { text: string }) => {
    return (
      <div className="flex flex-row gap-3">
        <CircleCheck size={24} className="text-primary" />
        <span className="text-[#535862] text-base leading-6">{text}</span>
      </div>
    );
  };

  const handleSaveclick = () => {
    saveClick();
  };

  const handleUpgradeClick = () => {
    nextClick();
  };

  return (
    <UpgradeModal
      isOpen={isOpen}
      onClose={handleModal}
      title="Unlock Expert Career Guidance"
      description="To continue and choose your career path expert, you'll
                  need to upgrade to Career PRO. Gain access to personalized
                  career counseling, expert insights, and tailored
                  recommendations to accelerate your growth"
      content={
        <div className="flex flex-col gap-3">
          <BodyCheckComponent text="1-on-1 Career Counseling" />
          <BodyCheckComponent text="Personalized Career Path Insights" />
          <BodyCheckComponent text="Exclusive Resources & Tools" />
          <BodyCheckComponent text="Priority Access to Top Experts" />
        </div>
      }
      footer={
        <ModalFooter buttonText="Upgrade to PRO" saveClick={handleSaveclick} />
      }
    />
  );
};

const CongratsModal: React.FC<{
  isOpen: boolean;
  setIsModalOpen: () => void;
}> = ({ isOpen, setIsModalOpen }) => {
  return (
    <UpgradeModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title="Congrats! You've just taken a big step toward shaping your career path! 🚀"
      description="Now, it's time to connect with an expert who can guide you toward your next big opportunity."
      content={
        <i className="text-secondary-foreground">
          Ready to meet your career counseling guru?
        </i>
      }
      footer={<ModalFooter buttonText="Continue" />}
    />
  );
};
