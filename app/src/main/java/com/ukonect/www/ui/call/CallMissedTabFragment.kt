package com.ukonect.www.ui.call

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ukonect.www.data.Call
import com.ukonect.www.databinding.CallMissedTabFragmentBinding
import com.ukonect.www.phone.PhoneCall
import com.ukonect.www.ui.binding.CallListAdapter
import com.ukonect.www.ui.main.UserListModel
import com.ukonect.www.ui.main.MainViewModel
import com.ukonect.www.util.Utils
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import me.everything.providers.android.calllog.Call.CallType


class CallMissedTabFragment : Fragment(){

    private var disposable: Disposable? = null
    private val callListAdapter: CallListAdapter by lazy { CallListAdapter(Call.MISSED_CALL) }
    private val usersModel: UserListModel by activityViewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var _binding: CallMissedTabFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding


    companion object {

        @JvmStatic
        fun newInstance(): CallMissedTabFragment {
            return CallMissedTabFragment()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {


        _binding = CallMissedTabFragmentBinding.inflate(inflater, container, false)
        val view = binding?.root

        // bind RecyclerView
        var recyclerView: RecyclerView? = binding?.callMissedTabRecylerView
        recyclerView?.layoutManager = LinearLayoutManager(this.context);
        recyclerView?.adapter = callListAdapter

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {


        var app_user = authModel.app_user ?: return

        disposable = Observable.fromCallable{

            var missedCallList =
                PhoneCall(
                    requireContext(),
                    app_user,
                    usersModel
                ).getCalls(CallType.MISSED);

            //return the line below
            missedCallList

        }.subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                { missedCallList ->
                    callListAdapter.setCallList(app_user, missedCallList)
                },
                { error ->  Utils.handleException(context,  error) }
            )


        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        disposable?.dispose()
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
