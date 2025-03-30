import {useEffect, useState} from 'react';
import {Calendar} from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {CardType, PaymentMethod, Category, CardInfo, ExpenseVO} from '@/types';
import {format} from 'date-fns';
import {CalendarIcon, Plus, CreditCard, Wallet} from 'lucide-react';
import {cn} from '@/lib/utils';
import {parseCurrency} from '@/utils/formatters';
import {fetchCategories} from "@/services/categoryService.ts";
import {fetchCardsByUser} from "@/services/cardService.ts";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from '@/components/ui/sheet';

interface ExpenseFormProps {
    onSubmit: (expense: ExpenseVO) => void;
    children?: React.ReactNode;
}

const ExpenseForm = ({onSubmit, children}: ExpenseFormProps) => {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [category, setCategory] = useState('');
    const [cardType, setCardType] = useState<CardType>('nubank');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('one-time');
    const [installments, setInstallments] = useState<number>(1);
    const [notes, setNotes] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [userCards, setUserCards] = useState<CardInfo[]>([]);
    const [userCardId, setUserCardId] = useState<number | undefined>(undefined);
    const isMobile = useIsMobile();

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate(new Date());
        setCategory('');
        setCardType('nubank');
        setPaymentMethod('one-time');
        setInstallments(1);
        setNotes('');
    };

    useEffect(() => {
        fetchCategories().then(setCategories);
        fetchCardsByUser().then(setUserCards);
        setUserCardId(userCards.find(card => card.type === cardType)?.userCardId);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!description || !amount || !category) {
            return;
        }

        const userCardIdNovo = userCards.find(card => card.type === cardType)?.userCardId;

        const newExpense: ExpenseVO = {
            description,
            amount: parseCurrency(amount),
            date,
            categoryId: category,
            paymentMethod: paymentMethod,
            observation: notes || "",
            userCardId: userCardIdNovo
        };

        if (paymentMethod === 'installment') {
            newExpense.installments = installments;
            newExpense.currentInstallment = 1;
        }

        if (paymentMethod === 'cash') {
            newExpense.userCardId = null;
        }

        onSubmit(newExpense);
        setOpen(false);
        resetForm();
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Supermercado"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                    <Input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9,]/g, '');
                            setAmount(value);
                        }}
                        className="pl-9"
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Data</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {date ? format(date, 'dd/MM/yyyy') : "Selecione uma data"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => date && setDate(date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione"/>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{backgroundColor: cat.color}}
                                        ></div>
                                        <span>{cat.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Método de Pagamento</Label>
                <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="flex flex-wrap gap-3"
                >
                    <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                        <RadioGroupItem value="cash" id="cash" className="text-primary"/>
                        <Label htmlFor="cash" className="flex items-center cursor-pointer">
                            <Wallet className="h-4 w-4 mr-2"/>
                            <span>À vista (dinheiro)</span>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                        <RadioGroupItem value="one-time" id="one-time" className="text-primary"/>
                        <Label htmlFor="one-time" className="flex items-center cursor-pointer">
                            <CreditCard className="h-4 w-4 mr-2"/>
                            <span>À vista (cartão)</span>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                        <RadioGroupItem value="installment" id="installment" className="text-primary"/>
                        <Label htmlFor="installment" className="flex items-center cursor-pointer">
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3 10h18M7 15h.01M12 15h.01M17 15h.01M7 5h10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4V9a4 4 0 014-4z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Parcelado</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {paymentMethod !== 'cash' && (
                <div className="space-y-2">
                    <Label htmlFor="cardType">Cartão</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {userCards.filter(card => card.type !== 'cash').map((card) => (
                            <Button
                                key={card.type}
                                type="button"
                                variant={cardType === card.type ? "default" : "outline"}
                                className={cn(
                                    "p-2 h-auto flex flex-col items-center justify-center gap-1",
                                    cardType === card.type && "bg-primary text-primary-foreground"
                                )}
                                onClick={() => setCardType(card.type)}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-5 rounded",
                                        cardType === card.type ? "opacity-100" : "opacity-70"
                                    )}
                                    style={{backgroundColor: card.color}}
                                ></div>
                                <span className="text-xs font-medium">
                                  {card.name.split(' ')[0]}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {paymentMethod === 'installment' && (
                <div className="space-y-2">
                    <Label htmlFor="installments">Número de Parcelas</Label>
                    <div className="flex flex-wrap gap-2">
                        {[2, 3, 6, 12].map((num) => (
                            <Button
                                key={num}
                                type="button"
                                variant={installments === num ? "default" : "outline"}
                                className={installments === num ? "bg-primary text-primary-foreground" : ""}
                                onClick={() => setInstallments(num)}
                            >
                                {num}x
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Informações adicionais sobre esta despesa..."
                    rows={2}
                />
            </div>

            <div className={cn("pt-4", isMobile ? "pb-10" : "")}>
                <Button type="submit" className="w-full">Salvar</Button>
                {!isMobile && (
                    <Button variant="outline" type="button" onClick={() => setOpen(false)} className="w-full mt-2">
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {children || (
                        <Button className="rounded-full flex items-center gap-2">
                            <Plus className="h-4 w-4"/>
                            <span>Nova Despesa</span>
                        </Button>
                    )}
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] overflow-y-auto pb-10">
                    <SheetHeader>
                        <SheetTitle>Adicionar Nova Despesa</SheetTitle>
                    </SheetHeader>
                    {formContent}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="rounded-full flex items-center gap-2">
                        <Plus className="h-4 w-4"/>
                        <span>Nova Despesa</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseForm;
