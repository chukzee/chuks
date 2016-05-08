package chuks.server.cache;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.WeakHashMap;

public class LRUOptimalCache<K, V> extends LinkedHashMap<K, V> {

    private final int cacheSizeStrongRef;
    Map weakRefMap = Collections.synchronizedMap(new WeakHashMap());//optimizes the  cache - cache will remain in memory until gc decides otherwise

    public LRUOptimalCache(int cacheSizeStrongRef) {
        super(cacheSizeStrongRef, 0.75f, true);
        this.cacheSizeStrongRef = cacheSizeStrongRef;
    }


    public int getOverallCacheSize() {
        return this.size() + weakRefMap.size();
    }
        
    @Override
    public V get(Object key) {
        V value;
        //check if it's in the linked hash map.
        if ((value = super.get(key)) == null)
        {   //here the object is not in the linked hash map.
            //O.k try to see if the gc has not yet discarded the object.
            value = (V) weakRefMap.get(key);
            //if value is null it means that the gc has discarded it or it was never sent to the weak hash map
        }
        return value;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        if (size() > cacheSizeStrongRef) {
            //Since this eldest entry will now be remove by LRU caching policy, 
            //we shall optimize the cache by sending the entry to the weak hash map 
            //where it will be until the gc decides to discard it on memory demand.
            
            weakRefMap.put(eldest.getKey(), eldest.getValue());
            return true;
        }
        return false;
    }
}
