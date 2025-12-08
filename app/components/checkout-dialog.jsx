"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "../components/language-provider"

export default function CheckoutDialog({ car, children }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Details, 2: Success
  const [dates, setDates] = useState({
    pickup: "",
    return: "",
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const { t } = useLanguage()

  // Calculate days and total price
  const pickupDate = dates.pickup ? new Date(dates.pickup) : null
  const returnDate = dates.return ? new Date(dates.return) : null

  let totalDays = 0
  if (pickupDate && returnDate) {
    const diffTime = Math.abs(returnDate - pickupDate)
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // Ensure at least 1 day if same day or valid range
    if (totalDays === 0 && pickupDate.getDate() === returnDate.getDate()) totalDays = 1
  }

  const totalPrice = totalDays > 0 ? totalDays * car.price : 0

  const handleBook = (e) => {
    e.preventDefault()
    // Simulate booking process
    setTimeout(() => {
      setStep(2)
    }, 1000)
  }

  const resetForm = () => {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setDates({ pickup: "", return: "" })
      setFormData({ name: "", email: "", phone: "" })
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-white/20 text-white backdrop-blur-xl">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {t.checkout.rent} {car.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400">{t.checkout.description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBook} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="text-gray-300">
                    {t.search.pickupDate}
                  </Label>
                  <Input
                    id="pickup"
                    type="date"
                    required
                    className="bg-white/10 border-white/20 text-white focus:border-primary"
                    value={dates.pickup}
                    onChange={(e) => setDates({ ...dates, pickup: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return" className="text-gray-300">
                    {t.search.returnDate}
                  </Label>
                  <Input
                    id="return"
                    type="date"
                    required
                    className="bg-white/10 border-white/20 text-white focus:border-primary"
                    value={dates.return}
                    onChange={(e) => setDates({ ...dates, return: e.target.value })}
                    min={dates.pickup}
                  />
                </div>
              </div>

              {totalDays > 0 && (
                <Card className="bg-primary/20 border-primary/30">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-300">{t.checkout.totalDuration}</p>
                      <p className="font-bold text-white">
                        {totalDays} {t.checkout.days}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">{t.checkout.totalPrice}</p>
                      <p className="text-2xl font-bold text-primary">${totalPrice}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    {t.checkout.fullName}
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder="John Doe"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      {t.checkout.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">
                      {t.checkout.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+212 6..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                  {t.checkout.confirmBooking} {totalDays > 0 && `• $${totalPrice}`}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-10 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">{t.checkout.successTitle}</h2>
            <p className="text-gray-400 max-w-xs">
              {t.checkout.successMessage.replace("{name}", formData.name).replace("{email}", formData.email)}
            </p>
            <Button onClick={resetForm} className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white">
              {t.checkout.close}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
