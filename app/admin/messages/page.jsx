"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ---------------- Fetch Messages ----------------
  const fetchMessages = async () => {
    try {
      const res = await fetch("https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/messages", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ---------------- Delete Message ----------------
  const deleteMessage = async (id) => {
    if (!confirm("Supprimer ce message ?")) return;

    try {
      const res = await fetch(`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Chargement...
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 text-white">
      <h1 className="text-4xl font-extrabold mb-10">
        Messages <span className="text-primary">Clients</span>
      </h1>

      {/* TABLE WRAPPER */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Liste des messages</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-300 border-b border-white/10">
                <th className="p-3">Nom</th>
                <th className="p-3">Email</th>
                <th className="p-3">Reçu le</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3 font-semibold">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 flex justify-center gap-3">

                    {/* Read Message */}
                    <Button
                      className="bg-blue-600 hover:bg-blue-500"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Lire
                    </Button>

                    {/* Reply Email */}
                    <a
                      href={`mailto:${msg.email}?subject=Réponse%20FADLO%20CAR`}
                      className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Répondre
                    </a>

                    {/* Delete */}
                    <Button
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ---------------- Dialog View Message ---------------- */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-black/80 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Message de {selectedMessage?.name}
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-300 mb-2">
            <strong>Email :</strong> {selectedMessage?.email}
          </p>

          <p className="text-gray-400 whitespace-pre-line">
            {selectedMessage?.message}
          </p>

          <p className="text-gray-500 mt-4 text-sm">
            Reçu le :{" "}
            {selectedMessage &&
              new Date(selectedMessage.createdAt).toLocaleString()}
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
