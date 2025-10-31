import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useCustomerQuotes, useCustomers, useQuoteItems } from "@/hooks/useCustomerQuotes";
import { CustomerQuotesList } from "./quote/CustomerQuotesList";
import { NewCustomerQuote } from "./quote/NewCustomerQuote";
import { PreviewCustomerQuote } from "./quote/PreviewCustomerQuote";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "list" | "new" | "edit" | "preview";

const CustomerQuotesPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [draftQuoteData, setDraftQuoteData] = useState<any>(null);
  
  const { quotes, isLoading, createQuote, updateQuote } = useCustomerQuotes();
  const { data: customers = [] } = useCustomers();
  const { toast } = useToast();

  const handleNewQuote = () => {
    setSelectedQuoteId(null);
    setDraftQuoteData(null);
    setViewMode("new");
  };

  const handleViewQuote = (id: string) => {
    setSelectedQuoteId(id);
    setViewMode("edit");
  };

  const handleSaveQuote = async (formData: any, action: "draft" | "preview") => {
    try {
      if (action === "draft") {
        // Save as draft
        if (selectedQuoteId) {
          await updateQuote({
            id: selectedQuoteId,
            ...formData,
            quote_date: formData.quote_date.toISOString(),
            expire_date: formData.expire_date.toISOString(),
            status: "Draft",
          });
        } else {
          await createQuote({
            ...formData,
            quote_date: formData.quote_date.toISOString(),
            expire_date: formData.expire_date.toISOString(),
            status: "Draft",
          });
        }
        setViewMode("list");
      } else {
        // Preview mode
        setDraftQuoteData(formData);
        setViewMode("preview");
      }
    } catch (error) {
      console.error("Error saving quote:", error);
    }
  };

  const handleSendQuote = async () => {
    try {
      if (selectedQuoteId) {
        await updateQuote({
          id: selectedQuoteId,
          ...draftQuoteData,
          quote_date: draftQuoteData.quote_date.toISOString(),
          expire_date: draftQuoteData.expire_date.toISOString(),
          status: "Quoting",
        });
      } else {
        await createQuote({
          ...draftQuoteData,
          quote_date: draftQuoteData.quote_date.toISOString(),
          expire_date: draftQuoteData.expire_date.toISOString(),
          status: "Quoting",
        });
      }
      
      toast({
        title: "Quote Sent",
        description: "The quote has been sent successfully. You can now convert it to an invoice.",
      });
      
      setViewMode("list");
      setDraftQuoteData(null);
    } catch (error) {
      console.error("Error sending quote:", error);
    }
  };

  const currentQuote = selectedQuoteId
    ? quotes.find((q) => q.id === selectedQuoteId)
    : null;

  const currentCustomer = (draftQuoteData?.customer_id || currentQuote?.customer_id)
    ? customers.find((c: any) => c.id === (draftQuoteData?.customer_id || currentQuote?.customer_id))
    : null;

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Quotes"
          description="Create and manage sales quotes for customers"
        />
        <CustomerQuotesList
          quotes={quotes}
          isLoading={isLoading}
          onNewQuote={handleNewQuote}
          onViewQuote={handleViewQuote}
        />
      </div>
    );
  }

  if (viewMode === "new" || viewMode === "edit") {
    return (
      <div className="space-y-6">
        <PageHeader
          title={viewMode === "new" ? "New Customer Quote" : "Edit Customer Quote"}
          description={viewMode === "new" ? "Create a new quote" : "Edit existing quote"}
        />
        <NewCustomerQuote
          onBack={() => setViewMode("list")}
          onSave={handleSaveQuote}
          initialData={currentQuote ? {
            ...currentQuote,
            quote_date: new Date(currentQuote.quote_date),
            expire_date: new Date(currentQuote.expire_date),
          } : undefined}
          quoteNumber={currentQuote?.quote_number}
        />
      </div>
    );
  }

  if (viewMode === "preview") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Preview Customer Quote"
          description="Review and send your quote"
        />
        <PreviewCustomerQuote
          quote={{
            ...draftQuoteData,
            quote_number: currentQuote?.quote_number || "QT-00001",
          }}
          customer={currentCustomer}
          items={draftQuoteData?.items || []}
          onBack={() => setViewMode(selectedQuoteId ? "edit" : "new")}
          onSend={handleSendQuote}
        />
      </div>
    );
  }

  return null;
};

export default CustomerQuotesPage;
