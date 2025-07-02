import { useNostr } from '@nostrify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';
import type { DocumentEvent } from './useDocuments';

export interface ZapReceiptEvent extends NostrEvent {
  kind: 9735;
}

export interface ZapRequestEvent extends NostrEvent {
  kind: 9734;
}

export function useZaps(eventId: string, options?: { enabled?: boolean }) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['zaps', eventId],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      const filter: NostrFilter = {
        kinds: [9735], // Zap receipts
        '#e': [eventId],
        limit: 1000,
      };
      
      const events = await nostr.query([filter], { signal });
      const zapReceipts = events as ZapReceiptEvent[];
      
      // Parse zap amounts from bolt11 invoices
      const zapsWithAmounts = zapReceipts.map(receipt => {
        const bolt11Tag = receipt.tags.find(tag => tag[0] === 'bolt11');
        const descriptionTag = receipt.tags.find(tag => tag[0] === 'description');
        
        let amount = 0;
        let zapRequest: ZapRequestEvent | null = null;
        
        if (descriptionTag && descriptionTag[1]) {
          try {
            zapRequest = JSON.parse(descriptionTag[1]) as ZapRequestEvent;
            const amountTag = zapRequest.tags.find(tag => tag[0] === 'amount');
            if (amountTag && amountTag[1]) {
              amount = parseInt(amountTag[1]) / 1000; // Convert millisats to sats
            }
          } catch (error) {
            console.warn('Failed to parse zap request:', error);
          }
        }
        
        return {
          receipt,
          zapRequest,
          amount,
          bolt11: bolt11Tag?.[1] || '',
        };
      });
      
      const totalAmount = zapsWithAmounts.reduce((sum, zap) => sum + zap.amount, 0);
      
      return {
        zapReceipts,
        zapsWithAmounts,
        zapCount: zapReceipts.length,
        totalAmount,
      };
    },
    enabled: !!eventId && (options?.enabled !== false),
  });
}

export function useZapDocument() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      document: _document, 
      amount, 
      comment: _comment = '' 
    }: { 
      document: DocumentEvent; 
      amount: number; // in sats
      comment?: string;
    }) => {
      if (!user) {
        throw new Error('Must be logged in to zap documents');
      }

      if (amount <= 0) {
        throw new Error('Zap amount must be greater than 0');
      }

      // Check if WebLN is available
      if (!window.webln) {
        throw new Error('WebLN wallet not found. Please install a WebLN-compatible wallet extension.');
      }

      try {
        // Enable WebLN
        await window.webln.enable();
      } catch {
        throw new Error('Failed to connect to WebLN wallet. Please check your wallet extension.');
      }

      // Get author's lightning address from their profile
      // This is a simplified implementation - in a real app you'd need to:
      // 1. Fetch the author's profile (kind 0)
      // 2. Extract lud06 or lud16 field
      // 3. Resolve the LNURL endpoint
      // 4. Create a proper zap request
      // 5. Send it to the LNURL callback
      
      // For now, we'll just show an error message
      throw new Error('Zapping is not fully implemented yet. This requires LNURL integration with the author\'s lightning address.');
    },
    onSuccess: (_, { document }) => {
      // Invalidate zaps query to refetch
      queryClient.invalidateQueries({
        queryKey: ['zaps', document.id],
      });
    },
  });
}

// Declare WebLN types for TypeScript
declare global {
  interface Window {
    webln?: {
      enable(): Promise<void>;
      sendPayment(paymentRequest: string): Promise<{ preimage: string }>;
      makeInvoice(args: { amount: number; defaultMemo?: string }): Promise<{ paymentRequest: string }>;
      signMessage(message: string): Promise<{ message: string; signature: string }>;
      verifyMessage(signature: string, message: string): Promise<{ valid: boolean }>;
    };
  }
}