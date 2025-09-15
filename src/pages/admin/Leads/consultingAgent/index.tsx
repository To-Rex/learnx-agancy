import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

interface LeadType {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  passport_number: string;
  region: string;
}

interface ConsultingFormData {
  notes: string;
}

const ConsultingAgentPage = () => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);
  const [formData, setFormData] = useState<ConsultingFormData>({ notes: "" });
  const [action, setAction] = useState<
    null | "approved" | "rejected" | "thinking"
  >(null);
  const [comment, setComment] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/leads/get-agent-leads?stage_in=consulting",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""
              }`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setLeads(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLeadSelect = (lead: LeadType) => {
    setSelectedLead(lead);
    setFormData({ notes: "" });
    setAction(null);
    setComment("");
  };

  const handleAction = (type: "approved" | "rejected" | "thinking") => {
    setAction(type);
    setComment("");
  };

  const handleSubmit = () => {
    if (!selectedLead) return;
    // Update note field from input
    const updatedLead = {
      ...selectedLead,
      note: formData.notes,
    };
    // Make API request
    fetch(
      "https://learnx-crm-production.up.railway.app/api/v1/leads/complete-as-consulting-agent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""
            }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      }
    ).then(async (res) => {
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      // alert("Lead submitted successfully!");
      setAction(null);
      setComment("");
      setSelectedLead(null);
      setFormData({ notes: "" });
      fetchLeads()
    });
    // .catch((err) => {
    //   alert("Error submitting lead: " + err.message);
    // });
  };

  return (
    <section>
      <div className="min-h-screen bg-background max-w-[1200px] border rounded-xl shadow-sm mx-auto p-4 flex flex-col">
        <div className="flex flex-1 gap-8">
          {/* Right: Leads List */}
          <div className="w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Consulting Leadlar Royxati
            </h2>
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="flex justify-center items-center mt-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
                </div>
              ) : leads.length === 0 ? (
                <div>No leads found.</div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleLeadSelect(lead)}
                    className={`p-3 border rounded cursor-pointer ${selectedLead?.id === lead.id
                        ? "bg-blue-100"
                        : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    <div className="font-bold">{lead.name}</div>
                    <div className="text-sm text-gray-600">{lead.phone}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Left: Form & Info */}
          <div className="flex-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consulting Agent Form</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLead ? (
                  <>
                    <div className="mb-4 p-3 border rounded bg-gray-50">
                      <div>
                        <b>Name:</b> {selectedLead.name}
                      </div>
                      <div>
                        <b>Phone:</b> {selectedLead.phone}
                      </div>
                      <div>
                        <b>Email:</b> {selectedLead.email}
                      </div>
                      <div>
                        <b>Source:</b> {selectedLead.source}
                      </div>
                      <div>
                        <b>Passport:</b> {selectedLead.passport_number}
                      </div>
                      <div>
                        <b>Region:</b> {selectedLead.region}
                      </div>
                    </div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Enter notes or details..."
                    />
                  </>
                ) : (
                  <div className="text-gray-400">
                    Select a lead to view details and fill the form.
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Action Buttons */}
            {selectedLead && (
              <div className="flex flex-col gap-4 mt-8 w-60 mx-auto">
                <Button
                  style={{ background: "rgb(119, 232, 108)", color: "#222" }}
                  className="h-12 text-lg font-bold"
                  onClick={() => handleAction("approved")}
                >
                  Approved
                </Button>
                <Button
                  style={{ background: "rgb(248, 52, 56)", color: "#fff" }}
                  className="h-12 text-lg font-bold"
                  onClick={() => handleAction("rejected")}
                >
                  Rejected
                </Button>
                <Button
                  style={{ background: "rgb(255, 223, 40)", color: "#222" }}
                  className="h-12 text-lg font-bold"
                  onClick={() => handleAction("thinking")}
                >
                  Thinking
                </Button>
                {(action === "rejected" || action === "thinking") && (
                  <div className="mt-2">
                    <Label>
                      {action === "rejected"
                        ? "Reason for rejection"
                        : "Callback note"}
                    </Label>
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        action === "rejected"
                          ? "Enter reason..."
                          : "When to call back?"
                      }
                      className="mt-1"
                    />
                    <Button className="mt-2 w-full" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </div>
                )}
                {action === "approved" && (
                  <Button className="mt-2 w-full" onClick={handleSubmit}>
                    Confirm Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingAgentPage;
