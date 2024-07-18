import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shadcnComponents/dialog';

import { Button } from '@shadcnComponents/button';

type Props = {
  triggerElement: React.ReactNode;
  size?: 'big' | 'small';
  title: string;
  description?: string;
  closeBtn?: boolean;
  children?: React.ReactNode;
};

function GenericModal({
  triggerElement,
  size = 'big',
  title,
  description,
  closeBtn = false,
  children,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>

      <DialogContent style={{ maxWidth: size == 'big' ? '800px' : '400px' }}>
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
