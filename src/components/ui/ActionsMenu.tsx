import { useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ActionsMenuItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  color?: 'error';
  disabled?: boolean;
}

interface ActionsMenuProps {
  items: ActionsMenuItem[];
}

const ActionsMenu = ({ items }: ActionsMenuProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="Actions">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            disabled={item.disabled}
            onClick={() => { handleClose(); item.onClick(); }}
            sx={item.color === 'error' ? { color: 'error.main' } : undefined}
          >
            <ListItemIcon sx={item.color === 'error' ? { color: 'error.main' } : undefined}>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionsMenu;
