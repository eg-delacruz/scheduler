import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from '@shadcnComponents/dialog';

import { Button } from '@shadcnComponents/button';

type Props = {
  triggerElement: React.ReactNode;
  size?: 'big' | 'small';
  title: string;
  description?: string;
  closeBtn?: boolean;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

function GenericModal({
  triggerElement,
  size = 'big',
  title,
  description,
  closeBtn = false,
  children,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>

      <DialogContent
        style={{
          maxWidth: size == 'big' ? '800px' : '400px',
          maxHeight: '800px',
          overflowY: 'auto',
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <hr />
        </DialogHeader>

        {children}

        {closeBtn && (
          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild>
              <Button variant='secondary'>Close</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default GenericModal;
