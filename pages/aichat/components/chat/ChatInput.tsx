import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendMessage } from '../../store/slices/chat.thunk';
import { setSelectedModel } from '../../store/slices/chat.slice';

interface ChatInputProps {
  isFullScreen: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ isFullScreen }) => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const isLoading = useAppSelector((state) => state.chat.isLoading);

  const models = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-3', name: 'Claude 3' },
    { id: 'gemini', name: 'Gemini Pro' },
  ];

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage({ text: input.trim(), modelId: selectedModel }));
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`bg-white border-t border-gray-200 flex-shrink-0 ${
        isFullScreen ? 'px-[280px] py-4' : 'p-3'
      }`}
    >
      <div className="flex items-end gap-2">
        <FormControl size="small" className="min-w-[120px]">
          <Select
            value={selectedModel}
            onChange={(e) => dispatch(setSelectedModel(e.target.value))}
            className="bg-gray-50"
          >
            {models.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          size="small"
          className="bg-gray-50"
        />

        <Tooltip title="Send">
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <div className="text-xs text-gray-400 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;