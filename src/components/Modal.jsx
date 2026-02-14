import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${(props) => props.theme.secondaryBackground || props.theme.body};
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.fontColor}33;
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.fontColor};
  opacity: 0.5;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    opacity: 1;
    background: ${(props) => props.theme.fontColor}1a;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
`;

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariant = {
  initial: { scale: 0.95, opacity: 0, y: 20 },
  isOpen: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.3 },
  },
  exit: { scale: 0.95, opacity: 0, y: 20 },
};

const Modal = ({ handleClose, children, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          variants={modalVariant}
          onClick={handleClose} // Close when clicking overlay
        >
          <ModalContainer
            variants={containerVariant}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            <CloseButton onClick={handleClose}>
              <FaTimes size={16} />
            </CloseButton>
            <ContentWrapper>{children}</ContentWrapper>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
