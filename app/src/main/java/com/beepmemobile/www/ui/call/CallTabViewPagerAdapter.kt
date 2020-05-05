package com.beepmemobile.www.ui.call


import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.beepmemobile.www.data.Call
import com.beepmemobile.www.ui.binding.CallListAdapter

class CallTabViewPagerAdapter(fragment: Fragment, _call_list_adapter: CallListAdapter, tab_titles: Array<String>)  : FragmentStateAdapter( fragment) {
    private val titles = tab_titles;
    private var call_list_adapter = _call_list_adapter
    override fun getItemCount(): Int {
        return titles.size
    }

    override fun createFragment(position: Int): Fragment {
        return when(position){
            0 -> CallDialledTabFragment(call_list_adapter.initType(Call.DIALLED_CALL))
            1 -> CallReceivedTabFragment(call_list_adapter.initType(Call.RECEIVED_CALL))
            else -> CallMissedTabFragment(call_list_adapter.initType(Call.MISSED_CALL))
        }
    }
}