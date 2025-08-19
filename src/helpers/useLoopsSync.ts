import { useMutation } from '@tanstack/react-query';
import { loopsService, LoopsContact } from '@/lib/loops';

/**
 * Hook for syncing user data to Loops.so
 */
export function useLoopsSync() {
  const syncToLoops = useMutation({
    mutationFn: async (contactData: LoopsContact) => {
      const result = await loopsService.createOrUpdateContact(contactData);
      
      // If this is a registration, send yhrisNewUser event (simplified)
      if (contactData.source === 'registration') {
        await loopsService.sendEvent(contactData.email, 'yhrisNewUser', {
          registrationDate: new Date().toISOString(),
          source: 'registration',
        });
      }
      
      return result;
    },
  });

  const updateLoopsContact = useMutation({
    mutationFn: async ({ email, properties }: { email: string; properties: Partial<LoopsContact> }) => {
      return await loopsService.updateContact(email, properties);
    },
  });

  const sendLoopsEvent = useMutation({
    mutationFn: async ({ email, eventName, properties }: { 
      email: string; 
      eventName: string; 
      properties?: Record<string, any> 
    }) => {
      return await loopsService.sendEvent(email, eventName, properties);
    },
  });

  return {
    syncToLoops: syncToLoops.mutate,
    updateContact: updateLoopsContact.mutate,
    sendEvent: sendLoopsEvent.mutate,
    isLoading: syncToLoops.isPending || updateLoopsContact.isPending || sendLoopsEvent.isPending,
  };
}
